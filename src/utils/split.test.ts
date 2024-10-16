import { splitDataToChunks } from "./split";
import {describe, expect, it, test} from "vitest"

describe("splitDataToChunk", () => {
  it ("shouldn't split data if size is greater than data length", () => {
    const data = "test";
    const size = 8;
    const result = splitDataToChunks(size, data);
    expect(result).toEqual([data]);
  })
  it("should split data into two chunks", () => {
    const data = "test";
    const size = 2;
    const result = splitDataToChunks(size, data);
    expect(result).toEqual(["te", "st"]);
  })

  it("should split data into three chunks", () => {
    const data = "test1test2test3";
    const size = 5;
    const result = splitDataToChunks(size, data);
    expect(result).toEqual(["test", "1tes", "t2te", "st3"]);
  })

  test("we should be able to reconstruct the original data", () => {
    const data = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    const size = 10;
    const result = splitDataToChunks(size, data);
    expect(Array.isArray(result)).toBeTruthy()
    expect(result.length).toBeGreaterThan(3);
    const reconstructedData = result.join("");
    expect(reconstructedData).toEqual(data);
  })
})