
import React from "react";
import { Row } from "antd"; 

const Unauthorized: React.FC = () => {
	return (
		<Row justify="center" align="middle" style={{minHeight:"100vh",color:"red", fontSize:80}}>
			
			401 Unauthorized
			

		</Row>
	);
};
export default Unauthorized;