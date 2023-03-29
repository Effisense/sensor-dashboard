const urlWithQueryParameters = (
  base: string,
  params: { [key: string]: string },
) => {
  const url = new URL(base);

  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key] || ""),
  );

  return url.href;
};

export default urlWithQueryParameters;
