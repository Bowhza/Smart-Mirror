import Header from '../components/Header';

export default function ClientUsers() {
  return (
    <>
      <Header title="Users" />
      <div className="flex-col bg-neutral-900 flex-grow p-3">
        <p className="font-bold text-xl">Users Testing</p>
        <div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In et felis nunc. Aenean posuere lobortis lectus,
            in interdum ipsum posuere vel. Proin laoreet ipsum velit, ac laoreet diam sagittis a. Curabitur mi quam,
            laoreet vel mi eu, sodales ornare enim. Suspendisse sit amet porttitor metus. Aliquam scelerisque libero in
            justo imperdiet, vel efficitur nulla consequat. Aenean congue lacinia dolor et placerat. Nam porta est a
            justo ultricies cursus.
          </p>
        </div>
      </div>
    </>
  );
}
