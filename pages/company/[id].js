export default function company(company) {
  return (
    <div>
      <h1>POST(投稿){company.id}</h1>
      <h2>{company.title}</h2>
      <p>{company.body}</p>
    </div>
  );
}

export async function getServerSideProps(params) {
  const id = params.id;
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  const company = await res.json();
  return { props: { company } };
}
