import { useEffect, useState } from "react";
import ImageMapper from "react-image-mapper";
import { Coords, ImageMap } from "./App";

const MAP_AREAS = [
	{ id: "1", shape: "rect", coords: [80, 110, 130, 160] },
	{ id: "2", shape: "rect", coords: [150, 110, 200, 160] },
	{ id: "3", shape: "rect", coords: [220, 110, 270, 160] },
	{ id: "4", shape: "rect", coords: [290, 110, 340, 160] },
	{ id: "5", shape: "rect", coords: [80, 180, 130, 230] },
	{ id: "6", shape: "rect", coords: [150, 180, 200, 230] },
	{ id: "7", shape: "rect", coords: [220, 180, 270, 230] },
	{ id: "8", shape: "rect", coords: [290, 180, 340, 230] },
	{ id: "9", shape: "rect", coords: [80, 250, 130, 300] },
	{ id: "10", shape: "rect", coords: [150, 250, 200, 300] },
	{ id: "11", shape: "rect", coords: [220, 250, 270, 300] },
	{ id: "12", shape: "rect", coords: [290, 250, 340, 300] },
];

const Mapper = () => {
	const [imageMap, setImageMap] = useState<ImageMap>({
		image: "",
		coords: [],
	});
	const setImgMap = (image: string) =>
		setImageMap((prev) => ({ ...prev, image }));
	const setCoords = (coords: Coords[]) =>
		setImageMap((prev) => ({
			...prev,
			coords: coords,
		}));

	const handleTableClick = (area: any) => {
		console.log(area);
	};
	const image = imageMap.image;
	// "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mesas-v8hdR0tbDPOu353UjRBMJNaEC7HTjM.jpg";
	const MAP = {
		name: "restaurant-map",
		areas: imageMap.coords.map((area, index) => ({
			id: index + 1,
			shape: "rect",
			coords: [area.x1, area.y1, area.x2, area.y2],
			preFillColor: "rgba(255, 255, 255, 0.5)",
		})),
	};

	console.log(
		imageMap.coords.map((area, index) => ({
			id: index + 1,
			shape: "rect",
			coords: area,
			preFillColor: "rgba(255, 255, 255, 0.5)",
		}))
	);

	useEffect(() => {
		const storeImageMap = localStorage.getItem("imageMap");
		if (storeImageMap === null) return;
		const paredImageMap: ImageMap = JSON.parse(storeImageMap);
		console.log({ paredImageMap });
		setImgMap(paredImageMap.image);
		setCoords(paredImageMap.coords);
	}, []);
	console.log({ imageMap });

	return (
		<div>
			<ImageMapper
				src={image}
				map={MAP}
				onClick={handleTableClick}
				width={500}
				imgWidth={474}
				responsive={true}
			/>
		</div>
	);
};

export default Mapper;
