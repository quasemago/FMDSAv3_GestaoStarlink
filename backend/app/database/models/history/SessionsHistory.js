import Sequelize, {Model} from "sequelize";

export default class SessionsHistory extends Model {
    static init(sequelize) {
        super.init(
            {
                // Model attributes.
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                date: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
            }, {
                sequelize,
                timestamps: false,
                tableName: "sessions_history",
            });
        return this;
    }

    static associate(models) {
        this.belongsTo(models.OnlineActivity, {
            foreignKey: 'online_activity_id',
        });
    }
}