import { loadGatewayConfig } from "../gateway/load-gateway-config";

describe("loadProposal", () => {
  it("should dynamically load the proposal", async () => {
    const proposal = await loadGatewayConfig("staged");

    expect(proposal.config).toBeDefined();
  });
});
