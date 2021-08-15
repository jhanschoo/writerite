test("environment is test", () => {
	expect(process.env.NODE_ENV).toBe("test");
});
