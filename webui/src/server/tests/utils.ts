import { Application } from "express";
import request from "supertest";
import { server } from "../index";

export const sendGet = (app: Application) => (uri: string) =>
	request(app).get(uri).send();
export const sendPost = (app: Application) => (uri: string) =>
	request(app).post(uri).send();

export const appSendGet = sendGet(server.app);
export const appSendPost = sendPost(server.app);
