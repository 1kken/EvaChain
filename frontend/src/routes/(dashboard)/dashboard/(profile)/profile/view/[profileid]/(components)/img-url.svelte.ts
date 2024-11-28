type ImageUrl = {
	url: string | null | undefined;
};

let _imgUrl = $state<ImageUrl>({ url: null });

// Getter
const getImgUrl = () => _imgUrl.url;

// Setter
const setImgUrl = (newUrl: string | null | undefined) => {
	_imgUrl.url = newUrl;
};

export { getImgUrl, setImgUrl };
