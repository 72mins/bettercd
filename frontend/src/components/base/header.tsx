const Header = ({ title }: { title: string }) => {
    return (
        <div className="flex flex-col gap-1 mt-8">
            <h1 className="text-xl font-semibold mb-4">{title}</h1>
        </div>
    );
};

export default Header;
