export const generateChartData = (prices) => {
    const currentTime = new Date().getTime();
    return ({
        labels: prices.map((_, index) => get12HourFormat(new Date(currentTime - 3600000 * index))).reverse(),
        datasets: [{
            data: prices,
        }]
    })
};

export const generateBackgroundColor = (changePercentage) => {
    let r = 100;
    let g = 100;
    let b = 100;
    const change = Math.min(155 * Math.abs(changePercentage) / 10, 155);

    if (changePercentage > 0) {
        g += change;
    } else {
        r += change;
    }

    return `rgba(${r}, ${g}, ${b}, 0.6)`;
}

export const get12HourFormat = (date) => {
    let hours = date.getHours();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return hours + ' ' + ampm;
}

export const isLatestData = (data) => {
    const { timestamp } = data;
    if (!timestamp || timestamp < new Date().getTime() - 5 * 60 * 1000) {
        return false;
    }
    return true;
}

export const formatPrice = (price) => {
    if (price > 10) {
        return price.toFixed(2);
    }
    if (price > 0.01) {
        return price.toFixed(4);
    }
    return price.toFixed(6);
}