import Sequelize, {Model} from "sequelize";

export default class LocationHistory extends Model {
    static init(sequelize) {
        super.init(
            {
                // Model attributes.
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                geoLocation: {
                    type: Sequelize.STRING,
                    length: 1024,
                    allowNull: false,
                },
                ipAddress: {
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
                tableName: "location_history",
            });
        return this;
    }

    static associate(models) {
        this.belongsTo(models.OnlineActivity, {
            foreignKey: 'online_activity_id',
        });
    }
}