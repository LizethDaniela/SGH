import express, { Express } from "express";
import dotenv from "dotenv";
import mongoose, { mongo, Mongoose } from "mongoose";
import cors from "cors";
import UserModule from "./modules/usermodule/init";
import SubjectModule from "./modules/materiamodule/init";
import StudentModule from "./modules/studentusermodule/init";

if (process.env.NODE_ENV == "development") {
    dotenv.config();
}

class App {
    private app: Express;
    private port: number;
    private clientMongo: Mongoose;
    private apiversion: string;
    constructor() {
        this.app = express();
        this.apiversion = process.env.API_VERSION || "api";
        this.port = Number(process.env.PORT) || 8000;
        this.clientMongo = mongoose;
        this.configure();
        this.configureDatabase();
        this.startModules();
    }
    private configure() {
        this.app.use(express.json());
        this.app.use(express.urlencoded());
        this.app.use(cors());
    }
    private configureDatabase() {
        const dataBaseName = process.env.DB_NAME;
        const dataBaseHost = process.env.DB_HOST;
        const dataBasePort = process.env.DB_PORT;
        const dataBaseUser = process.env.DB_USER;
        const dataBasePassword = process.env.DB_PASSWORD;
        //mongodb://root:example@mongo:27017/
        const connectionString = `mongodb://${dataBaseUser}:${dataBasePassword}@${dataBaseHost}:${dataBasePort}`;
        this.clientMongo.connect(connectionString);
        this.clientMongo.connection.on("open", () => {
            console.log("sucess connect to database");
        });
        this.clientMongo.connection.on("error", (err) => {
            console.error("can not connect to the database");
            console.error(err);
        });
    }
    private startModules() {
        console.log("Load Modules!");
        new UserModule(`/${this.apiversion}`, ["user", "materias"], this);
        new SubjectModule(`/${this.apiversion}`, this);
        new StudentModule(`/${this.apiversion}`, this);
    }
    public getApp(): Express {
        return this.app;
    }
    public getClientMongoose(): Mongoose {
        return this.clientMongo;
    }
    public getPort(): number {
        return this.port;
    }
}
export default App;