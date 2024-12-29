import React from 'react';
import CabinetPage from "@/components/pages/cabinet-page/CabinetPage";
import {Metadata} from "next";

export const metadata: Metadata = {
	title: "Cabinet",
}

const Cabinet = () => {
	return (
		<CabinetPage/>
	);
};

export default Cabinet;
