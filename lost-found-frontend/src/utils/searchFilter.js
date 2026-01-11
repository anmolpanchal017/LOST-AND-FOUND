export const searchFilter = (items, keyword) => {
  if (!keyword) return items;

  const lower = keyword.toLowerCase();

  return items.filter((item) => {
    return (
      item.title?.toLowerCase().includes(lower) ||
      item.category?.toLowerCase().includes(lower) ||
      item.description?.toLowerCase().includes(lower) ||
      item.locationText?.toLowerCase().includes(lower) ||
      item.phone?.includes(lower)
    );
  });
};
