import Sequelize, {Model} from "sequelize";

export default class BrowsingHistory extends Model {
    static init(sequelize) {
        super.init(
            {
                // Model attributes.
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                url: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                date: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
            }, {
                sequelize,
                timestamps: false,
                tableName: "browsing_history",
            });
        return this;
    }

    static associate(models) {
        this.belongsTo(models.OnlineActivity, {
            foreignKey: 'online_activity_id',
        });
    }
}