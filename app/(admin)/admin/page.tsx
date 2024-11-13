import Link from "next/link";

export default function AdminPage() {
  return (
    <div>
      <h1>Admin</h1>
      <ul>
        <li>
          <Link href="/admin/system">System</Link>
        </li>
        <li>
          <Link href="/admin/store">Store</Link>
        </li>
      </ul>
    </div>
  );
}