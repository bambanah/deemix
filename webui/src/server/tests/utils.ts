import request from "supertest";
import { app } from "@/main";

export const appSendGet = (uri: string) => request(app).get(uri);
export const appSendPost = (uri: string) => request(app).post(uri);
