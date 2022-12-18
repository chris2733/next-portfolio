function Error({ statusCode }: { statusCode: number }) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black text-white">
      <h1>
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : "An error occurred on client"}
      </h1>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: { res: any; err: any }) => {
  // todo:fix using any here
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
