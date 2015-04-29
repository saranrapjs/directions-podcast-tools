module.exports = function(addr) {
	var is_newport_news = false;
	addr.forEach(function(component) {
		if (/(Newport News)/.test(component.long_name) === true) {
			is_newport_news = true;
		}
	})
	return is_newport_news;
}