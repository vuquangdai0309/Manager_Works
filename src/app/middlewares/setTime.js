function formatDuration(duration) {
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    let formattedDuration = '';
    if (days > 0) {
        formattedDuration += `${days} ngày `;
    }
    if (hours > 0) {
        formattedDuration += `${hours} giờ `;
    }
    if (minutes > 0) {
        formattedDuration += `${minutes} phút `;
    }
    formattedDuration += `${seconds} giây trước`;

    return formattedDuration;
}
module.exports = { formatDuration }    