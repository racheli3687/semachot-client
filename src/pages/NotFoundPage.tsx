import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function NotFoundPage() {
   return (
      <section className="mesh grid min-h-dvh place-items-center px-6 text-center">
         <div className="flex flex-col items-center gap-4">
            <motion.p
               className="bg-gradient-to-l from-[#ff9f6b] via-[#ff6fa8] to-[#4fb6ff] bg-clip-text text-[9rem] leading-none font-extrabold tracking-[-0.05em] text-transparent sm:text-[13rem]"
               initial={{ opacity: 0, scale: 0.8, filter: "blur(12px)" }}
               animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
               transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
               aria-hidden="true"
            >
               404
            </motion.p>
            <motion.div
               className="flex flex-col items-center gap-4"
               initial={{ opacity: 0, y: 16 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.4, duration: 0.6 }}
            >
               <h1 className="text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">הדף לא נמצא.</h1>
               <p className="text-xl text-ink-2">ייתכן שהקישור שגוי, או שהדף הוסר.</p>
               <Link to="/" className="btn btn-primary btn-lg mt-2">חזרה ללוח שלי</Link>
            </motion.div>
         </div>
      </section>
   );
}
