export const getOneRepMax = (w: number, r: number) => {
    return (w * (1 + r / 30)).toFixed(2);
};
