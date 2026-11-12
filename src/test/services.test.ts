import { describe, expect, it } from "vitest";
import { services } from "@/lib/services";

describe("Service showcases", () => {
  it("opens YouTube films for Product launch film", () => {
    expect(services.find((service) => service.title === "Product launch film")?.showcase).toBe("film");
  });
  it("opens images for Product PDP", () => {
    expect(services.find((service) => service.title === "Product PDP")?.showcase).toBe("pdp");
  });
  it("does not open a showcase for Website hero section animation", () => {
    expect(services.find((service) => service.title === "Website hero section animation")?.showcase).toBeNull();
  });
});