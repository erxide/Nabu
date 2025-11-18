import React from "react";
import { Routes, Route } from "react-router-dom";
import App from "./App";
import AdminApp from "./admin/App";

export default function AppRoutes() {
	return (
		<Routes>
			<Route path="/admin" element={<AdminApp />} />
		</Routes>
	);
}
