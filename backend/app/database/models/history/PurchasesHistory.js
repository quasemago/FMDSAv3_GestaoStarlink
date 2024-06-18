import Sequelize, {Model} from "sequelize";

export default class PurchasesHistory extends Model {
    static init(sequelize) {
        super.init(
            {
                // Model attributes.
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                description: {
                    type: Sequelize.STRING,
                    length: 1024,
                    allowNull: false,
                },
                price: {
                    type: Sequelize.DOUBLE,
                    allowNull: false,
                },
                date: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
            }, {
                sequelize,
                timestamps: false,
                tableName: "purchases_history",
            });
        return this;
    }

    static associate(models) {
        this.belongsTo(models.OnlineActivity, {
            foreignKey: 'online_activity_id',
        });
    }
}