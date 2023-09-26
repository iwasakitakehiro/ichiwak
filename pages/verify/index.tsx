import { signIn } from "next-auth/react";
import { useState } from "react";

function Verify() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const result = await signIn(
        "credentials",
        {
          email: formData.email,
          password: formData.password,
        },
        { callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/discover` }
      );
    } else {
      const data = await response.json();
      setErrorMessage(data.error);
    }
  };
  return <></>;
}

export async function getServerSideProps(context: any) {
  const { token } = context.query;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${token}`
  );

  if (!response.ok) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: "/auth/login",
      permanent: false,
    },
  };
}

export default Verify;
