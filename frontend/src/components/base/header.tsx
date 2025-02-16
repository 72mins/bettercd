const Header = ({ title, subTitle }: { title: string; subTitle: string }) => {
    return (
        <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-normal tracking-tight">{title}</h1>
            <p className="text-sm text-neutral-500">{subTitle}</p>
            <hr className="border-gray-100 border-t-1 mt-2" />
        </div>
    );
};

export default Header;
