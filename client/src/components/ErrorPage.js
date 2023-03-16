import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <div id="error-page" className="flex items-center text-center justify-center min-h-screen" >
            <h1 className=" text-6xl text-red-600 " >Oops!</h1>
            <p className=" text-3xl " >Sorry, an unexpected error has occurred.</p>
            <p>
                <i className=" text-red-600 text-lg " >{error.statusText || error.message}</i>
            </p>
        </div>
    );
}