import { Link } from "react-router-dom";

export default function NotFoundPage() {
   return (
      <section>
         <h1>הדף לא נמצא</h1>
         <p>ייתכן שהקישור שגוי, או שהדף הוסר.</p>
         <Link to="/">חזרה ללוח שלי</Link>
      </section>
   );
}