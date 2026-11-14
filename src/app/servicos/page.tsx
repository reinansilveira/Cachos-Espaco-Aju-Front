import { redirect } from "next/navigation";

// A página virou uma seção da home.
export default function Page() {
  redirect("/#servicos");
}
