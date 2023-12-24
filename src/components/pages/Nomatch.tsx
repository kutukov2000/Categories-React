import React from "react";
import { Button, Result } from 'antd';
import { Link } from "react-router-dom";

const NoMatch: React.FC = () => {
    return (
        <Result
            status="404"
            title="404"
            subTitle="Вибачте, дану сторінку не знайдено."
            extra={
                <Link to={"/"}>
                    <Button type="primary">Go back</Button>
                </Link>
            }
        />
    );
}
export default NoMatch;