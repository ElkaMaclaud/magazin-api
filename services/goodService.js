import GoodModel from "../models/goodModel.js"
import SellerModel from "../models/sellerModel.js"

// Сервис для получения товаров из монгод

// import * as path from "path";
// import * as fs from "fs";

export class GoodService {
  buildMatchCondition(value) {
    const matchCondition = {};

    if (typeof value === "string") {
      matchCondition[value] = { $exists: true };
    } else if (typeof value === "object") {
      const totalField = Object.keys(value);
      for (const key of totalField) {
        if (key === "category") {
          matchCondition[key] = { [key]: { $in: [value[key]] } };
        } else if (key === "sort") {
          matchCondition[key] = { [value[key]]: 1 };
        }
      }
    }
    return matchCondition;
  }

  async createSelers(dto) {
    const validateSellersData = (data) => {
      return data.every(seller => seller.name && seller.email);
    };

    if (!validateSellersData(dto)) {
      console.error("Некоторые записи не содержат обязательные поля!");
    } else {
      await SellerModel.insertMany(dto)
        .then(() => console.log("Данные успешно сохранены"))
        .catch(err => console.error("Ошибка при сохранении данных:", err));
    }
  }
  async getGoodsByDiscountСlassificationUser(
    email,
    value,
    options,
  ) {
    const offset = options.offset || 0;
    const limit = options.limit || 50;
    const sortField = this.buildMatchCondition(value).sort || { price: 1 };
    const existsFilter =
      this.buildMatchCondition(value).category ||
      this.buildMatchCondition(value);
    return await GoodModel
      .aggregate([
        {
          $match: existsFilter,
        },
        {
          $lookup: {
            from: "User",
            let: { userEmail: email },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$privates.email", "$$userEmail"] },
                },
              },
            ],
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            count: {
              $let: {
                vars: {
                  matchedItem: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$user.cart",
                          as: "cartItem",
                          cond: {
                            $eq: [
                              "$$cartItem.goodId",
                              { $toString: "$$ROOT._id" },
                            ],
                          },
                        },
                      },
                      0,
                    ],
                  },
                },
                in: {
                  $cond: {
                    if: { $ne: ["$$matchedItem", null] },
                    then: "$$matchedItem.count",
                    else: 0,
                  },
                },
              },
            },
          },
        },
        {
          $addFields: {
            favorite: {
              $let: {
                vars: {
                  matchedFavorite: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$user.favorites",
                          as: "favoriteItem",
                          cond: {
                            $eq: [
                              "$$favoriteItem",
                              { $toString: "$$ROOT._id" },
                            ],
                          },
                        },
                      },
                      0,
                    ],
                  },
                },
                in: {
                  $cond: {
                    if: { $gt: [{ $type: "$$matchedFavorite" }, "missing"] },
                    then: true,
                    else: "$$REMOVE",
                  },
                },
              },
            },
          },
        },
        // Проверка того, что входит в  matched:
        // {
        //   $addFields: {
        //     matchedFavorite: {
        //       $let: {
        //         vars: {
        //           matched: {
        //             $filter: {
        //               input: "$user.favorites",
        //               as: "favoriteItem",
        //               cond: { $eq: ["$$favoriteItem", { $toString: "$$ROOT._id" }] }
        //             }
        //           }
        //         },
        //         in: {
        //           matched: {
        //             $arrayElemAt: ["$$matched", 0]
        //           },
        //           rootId: { $toString: "$$ROOT._id" },
        //           favoriteExists: { $cond: { if: { $ne: ["$$matched", null] }, then: true, else: false } }
        //         }
        //       }
        //     }
        //   }
        // },
        {
          $project: {
            user: 0,
          },
        },
        // { $sort: sortField },
        { $skip: offset },
        { $limit: limit },
      ])
      .exec();
  }

  async getGoodsByCategory(
    dto,
    options,
  ) {
    const query = GoodModel.find({
      category: { $in: dto.category },
    });
    if (options.offset) {
      query.skip(options.offset);
    }
    if (options.limit) {
      query.limit(options.limit);
    }

    return query.exec();
  }

  async getGoodsByIds(
    dto,
    options,
  ) {
    const query = GoodModel.find({ _id: { $in: dto.ids } });
    if (options.offset) {
      query.skip(options.offset);
    }
    if (options.limit) {
      query.limit(options.limit);
    }

    return query.exec();
  }

  async getGoodsByDiscountСlassification(
    dto,
    options,
  ) {
    const query = GoodModel.find({ [dto]: { $exists: true } });
    if (options.offset) {
      query.skip(options.offset);
    }
    if (options.limit) {
      query.limit(options.limit);
    }

    return query.exec();
  }

  async getGoodById(id) {
    return GoodModel.findById(id).exec();
  }
  async getGoodByIdForUser(
    id,
    email,
  ) {
    const result = await GoodModel
      .aggregate([
        {
          $match: { $expr: { $eq: [{ $toString: "$_id" }, id] } },
        },
        {
          $lookup: {
            from: "User",
            let: { userEmail: email, goodId: id },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$privates.email", "$$userEmail"] },
                },
              },
              {
                $addFields: {
                  cart_item: {
                    $filter: {
                      input: "$cart",
                      as: "item",
                      cond: { $eq: ["$$item.goodId", "$$goodId"] },
                    },
                  },
                },
              },
              {
                $project: {
                  count: { $arrayElemAt: ["$cart_item.count", 0] },
                },
              },
            ],
            as: "user",
          },
        },
        {
          $addFields: {
            count: {
              $cond: {
                if: { $gt: [{ $size: "$user" }, 0] },
                then: { $arrayElemAt: ["$user.count", 0] },
                else: 0,
              },
            },
            favorite: {
              $cond: {
                if: {
                  $in: [
                    id,
                    [
                      {
                        $arrayElemAt: ["$user.favorites", 0],
                      },
                    ],
                  ],
                },
                then: true,
                else: false,
              },
            },
          },
        },
        {
          $lookup: {
            from: "Review",
            let: { goodId: { $toString: "$_id" } },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$$goodId", "$goodId"] },
                },
              },
            ],
            as: "reviews",
          },
        },
        {
          $addFields: {
            reviewCount: { $size: "$reviews" },
            reviewAvg: { $avg: "$reviews.rating" },
          },
        },
        {
          $project: {
            user: 0,
          },
        },
      ])
      .exec();

    return result[0];
  }

  // Второй вариант агрегации!!!
  // Более интуитивный!

  // async getGoodById(id: string, email: string): Promise<GoodModel | void> {
  //   const result = await GoodModel
  //     .aggregate([
  //       // Находим товар по его ID
  //       {
  //         $match: { $expr: { $eq: [{ $toString: "$_id" }, id] } },
  //       },

  //       {
  //         $lookup: {
  //           from: "User",
  //           let: { userEmail: email },
  //           pipeline: [
  //             {
  //               $match: {
  //                 $expr: { $eq: ["$private.email", "$$userEmail"] },
  //               },
  //             },
  //             {
  //               $unwind: "$cart",
  //             },
  //             {
  //               $match: { "cart.goodId": id },
  //             },
  //             {
  //               $project: {
  //                 count: "$cart.count",
  //                 favorites: 1,
  //               },
  //             },
  //           ],
  //           as: "user",
  //         },
  //       },
  //       // Возвращаем результат
  //       {
  //         $addFields: {
  //           count: {
  //             $arrayElemAt: ["$user.count", 0],
  //           },

  //           favorite: {
  //             $cond: {
  //               if: {
  //                 $in: [
  //                   id,
  //                   {
  //                     $arrayElemAt: ["$user.favorites", 0],
  //                   },
  //                 ],
  //               },

  //               then: true,
  //               else: false,
  //             },
  //           },
  //         },
  //       },
  //       {
  //         $replaceRoot: {
  //           newRoot: {
  //             $mergeObjects: [
  //               {
  //                 count: "$count",
  //                 favorite: "$favorite"
  //               },
  //               "$$ROOT",
  //             ],
  //           },
  //         },
  //       },
  // {
  //         $lookup: {
  //           from: "Review",
  //           let: { goodId: { $toString: "$_id" } },
  //           pipeline: [
  //             {
  //               $match: {
  //                 $expr: { $eq: ["$$goodId", "$goodId"] },
  //               },
  //             },
  //           ],
  //           as: "reviews",
  //         },
  //       },
  //       {
  //         $addFields: {
  //           reviewCount: { $size: "$reviews" },
  //           reviewAvg: { $avg: "$reviews.rating" },
  //         },
  //       },
  //       {
  //         $project: {
  //           user: 0,
  //         },
  //       },
  //     ])
  //     .exec();
  //     return result[0]
  // }

  // Функция для занесения данных в бд (одноразовая)
  // Функцию для создания и внесения товаров в бд нужно будет реализовать для продавцов в будущем возможно..., но такой цели пока нет
  // Собственно нет и фронта для продавцов, так что Функцию для создания товаров будет излишней пока...

  // async writeDataToBD() {
  //   const filePath = path.join(process.cwd(), "./src/database", "data.json");
  //   const rawdata = fs.readFileSync(filePath, "utf8");
  //   const data: { good: GoodDto[] } = JSON.parse(rawdata);
  //   await GoodModel.insertMany(data.good);
  // }
}
