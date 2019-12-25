const splitSeparatedFields = (fields: string, separator = ','): string[] => {
  return fields
    .split(separator)
    .map((field) => field.trim())
    .filter((field) => !!field);
}

export default splitSeparatedFields;
