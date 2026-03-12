import { describe, expect, it } from "vitest";
import { nextCaptureState } from "../../src/features/capture/captureState";

describe("captureState", () => {
  it("transitions to CAPTURING on capture", () => {
    const next = nextCaptureState({ stage: "PREVIEW", isBusy: false }, "CAPTURE");
    expect(next.stage).toBe("CAPTURING");
    expect(next.isBusy).toBe(true);
  });
});
