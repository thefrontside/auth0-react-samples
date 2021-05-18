import { exec, StdIO, daemon } from "@effection/node";
import { Operation, Stream } from "effection";
import { logger } from "../logger/logger";

function writeOut(channel: Stream<string>, out: NodeJS.WriteStream) {
  return channel.forEach(function (data) {
    return new Promise((resolve, reject) => {
      out.write(data, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}

export function executeAndOut(command: string): Operation<void> {
  return function* (task) {
    const p = yield exec(command).run(task);
    task.spawn(writeOut(p.stdout, process.stdout));
    task.spawn(writeOut(p.stderr, process.stderr));
    yield p.expect();
  };
}

export function runScriptTask(command: string): Operation<void> {
  return function* (scope) {
    try {
      const server: StdIO = daemon(command).run(scope);
      scope.spawn(writeOut(server.stdout, process.stdout));
      scope.spawn(writeOut(server.stderr, process.stderr));

      yield;
    } catch (err) {
      console.error(err);
    } finally {
      logger.done(`shutting down task ${command}`);
    }
  };
}
