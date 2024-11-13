import Link from 'next/link';

export default function SystemPage() {
  return (
    <div>
      <h1>System</h1>
      <ul>
        <li>
          <Link href="/admin">Back</Link>
        </li>
      </ul>
    </div>
  );
}