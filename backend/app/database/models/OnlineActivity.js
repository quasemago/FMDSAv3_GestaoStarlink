import Sequelize, {Model} from "sequelize";

export default class OnlineActivity extends Model {
    static init(sequelize) {
        super.init(
            {
                // Model attributes.
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                }
            }, {
                sequelize,
                timestamps: false,
                tableName: "online_activity",
            });
        return this;
    }

    static associate(models) {
        this.belongsTo(models.Client, {
            foreignKey: 'client_id'
        });
        this.hasMany(models.BrowsingHistory, {
            foreignKey: 'online_activity_id'
        });
        this.hasMany(models.InterestsHistory, {
            foreignKey: 'online_activity_id'
        });
        this.hasMany(models.LocationHistory, {
            foreignKey: 'online_activity_id'
        });
        this.hasMany(models.PurchasesHistory, {
            foreignKey: 'online_activity_id'
        });
        this.hasMany(models.SessionsHistory, {
            foreignKey: 'online_activity_id'
        });
    }
}