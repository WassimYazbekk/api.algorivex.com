import { TailSpin } from "react-loader-spinner";

const Loading: React.FC = () => {
    return (
        <div className="min-h-screen w-full text-4xl flex flex-col items-center justify-center">
            <TailSpin
                visible={true}
                height="80"
                width="80"
                ariaLabel="tail-spin-loading"
                color="#FFF"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    );
};

export default Loading;
