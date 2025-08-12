import request from "supertest";
import { app } from "@/main.js";

export const appSendGet = (uri: string) => request(app).get(uri);
export const appSendPost = (uri: string) => request(app).post(uri);
