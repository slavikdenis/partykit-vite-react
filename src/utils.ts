export const getPostId = (): string => {
	let post = window.location.pathname;

	if (post.startsWith('/')) {
		post = post.slice(1);
	}

	if (post.endsWith('/')) {
		post = post.slice(0, -1);
	}

	return post.replaceAll('/', '-') || 'default';
};
