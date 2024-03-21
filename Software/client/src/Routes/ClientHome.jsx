import Header from '../components/Header';

export default function ClientHome({ isConnected }) {
  return (
    <>
      <Header title="Home" />
      <div className="flex-col flex-grow p-3">
        <h2 className="text-xl">
          Socket Status:{' '}
          {isConnected ? (
            <span className="text-green-500 font-bold">Connected</span>
          ) : (
            <span className="text-red-500 font-bold">Disconnected</span>
          )}
        </h2>
      </div>
    </>
  );
}
