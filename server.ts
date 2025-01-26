import express, { Application, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { subscribeEvent } from "./src/Handler";
import { redisPub } from "./src/RedisService";

subscribeEvent();