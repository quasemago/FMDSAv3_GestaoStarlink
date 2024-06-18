import Sequelize, {Model} from "sequelize";

export default class InterestsHistory extends Model {
    static init(sequelize) {
        super.init(
            {
                // Model attributes.
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                keyword: {
                    type: Sequelize.STRING,
                    length: 1024,
                    allowNull: false,
                },
                date: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
            }, {
                sequelize,
                timestamps: false,
                tableName: "interests_history",
            });
        return this;
    }

    static associate(models) {
        this.belongsTo(models.OnlineActivity, {
            foreignKey: 'online_activity_id',
        });
    }
}