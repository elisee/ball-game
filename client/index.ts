/// <reference path="../typings/browser.d.ts" />
/// <reference path="../shared.d.ts" />

import * as renderer from "./renderer";
import * as gameClient from "./gameClient";

renderer.start();
gameClient.connect();
