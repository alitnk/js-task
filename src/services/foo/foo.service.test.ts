import { FooService } from "./foo.service";

test("should work", () => {
  expect(new FooService("foo").getValue()).toBe("foo");
  expect(new FooService("foo").getValue()).not.toBe("bar");
});
