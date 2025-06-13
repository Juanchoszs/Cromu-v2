"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { motion, useScroll, useTransform } from "framer-motion"
import { Cookie, Settings, BarChart3, Zap, Target, Shield, FileText, Mail, Phone, ExternalLink } from "lucide-react"

export default function PoliticaCookiesPage() {
  const { language } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  const translations = {
    watermark: { es: "COOKIES", en: "COOKIES" },
    title: { es: "Política de Cookies", en: "Cookies Policy" },
    subtitle: { es: "GESTIÓN DE COOKIES Y PRIVACIDAD", en: "COOKIE MANAGEMENT AND PRIVACY" },
    lastUpdated: { es: "Última actualización: 13 de junio de 2025", en: "Last updated: June 13, 2025" },
    tagline: { es: "Transparencia en cada cookie", en: "Transparency in every cookie" },
    sections: {
      whatAreCookies: {
        title: { es: "¿Qué son las cookies?", en: "What are cookies?" },
        icon: Cookie,
        content: {
          es: "Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita nuestro sitio web. Estas cookies nos ayudan a recordar sus preferencias, analizar el uso del sitio y ofrecerle una experiencia más personalizada.",
          en: "Cookies are small text files that are stored on your device when you visit our website. These cookies help us remember your preferences, analyze site usage, and provide you with a more personalized experience."
        }
      },
      cookieTypes: {
        title: { es: "Tipos de cookies que utilizamos", en: "Types of cookies we use" },
        icon: Settings,
        essential: {
          title: { es: "Cookies esenciales", en: "Essential cookies" },
          icon: Zap,
          content: {
            es: "Son necesarias para que el sitio web funcione correctamente. Incluyen cookies que le permiten iniciar sesión en áreas seguras de nuestro sitio.",
            en: "These are necessary for the website to function properly. They include cookies that allow you to log in to secure areas of our site."
          }
        },
        performance: {
          title: { es: "Cookies de rendimiento", en: "Performance cookies" },
          icon: BarChart3,
          content: {
            es: "Recopilan información sobre cómo los visitantes usan nuestro sitio web, como qué páginas visitan con más frecuencia. Toda la información que recopilan estas cookies es anónima.",
            en: "They collect information about how visitors use our website, such as which pages they visit most frequently. All information these cookies collect is anonymous."
          }
        },
        functionality: {
          title: { es: "Cookies de funcionalidad", en: "Functionality cookies" },
          icon: Settings,
          content: {
            es: "Se utilizan para recordar sus preferencias y proporcionar características mejoradas y más personales.",
            en: "They are used to remember your preferences and provide enhanced, more personal features."
          }
        },
        advertising: {
          title: { es: "Cookies de publicidad", en: "Advertising cookies" },
          icon: Target,
          content: {
            es: "Se utilizan para ofrecer anuncios más relevantes para usted y sus intereses. También se utilizan para limitar la cantidad de veces que ve un anuncio y para ayudar a medir la efectividad de las campañas publicitarias.",
            en: "They are used to deliver advertisements more relevant to you and your interests. They are also used to limit the number of times you see an advertisement and help measure the effectiveness of advertising campaigns."
          }
        }
      },
      controlCookies: {
        title: { es: "Cómo controlar las cookies", en: "How to control cookies" },
        icon: Shield,
        content: {
          es: "Usted puede controlar y/o eliminar las cookies como desee. Para obtener más información, visite aboutcookies.org. Puede eliminar todas las cookies que ya están en su computadora y puede configurar la mayoría de los navegadores para evitar que se coloquen. Sin embargo, si hace esto, es posible que tenga que ajustar manualmente algunas preferencias cada vez que visite un sitio y que algunos servicios y funcionalidades no funcionen.",
          en: "You can control and/or delete cookies as you wish. For more information, visit aboutcookies.org. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. However, if you do this, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work."
        },
        link: "https://www.aboutcookies.org/"
      },
      changes: {
        title: { es: "Cambios en nuestra política de cookies", en: "Changes to our cookie policy" },
        icon: FileText,
        content: {
          es: "Podemos actualizar nuestra política de cookies de vez en cuando. Le notificaremos sobre cualquier cambio publicando la nueva política en esta página y actualizando la fecha de \"Última actualización\" en la parte superior de esta política de cookies.",
          en: "We may update our cookie policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the \"Last updated\" date at the top of this cookie policy."
        }
      },
      contact: {
        title: { es: "Contacto", en: "Contact" },
        icon: Mail,
        content: {
          es: "Si tiene alguna pregunta sobre esta política de cookies, puede contactarnos en:",
          en: "If you have any questions about this cookie policy, you can contact us at:"
        },
        email: "atencionclientecromu@gmail.com",
        phone: "+57 314 2556085",
        phone2: "+57 310 2223491"
      }
    }
  }

  const renderContent = (content: string) => {
    const parts = content.split('aboutcookies.org')
    if (parts.length > 1) {
      return (
        <motion.p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed"
          initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }} viewport={{ once: true }}>
          {parts[0]}
          <motion.a href={translations.sections.controlCookies.link} target="_blank" rel="noopener noreferrer"
            className="text-[#1a5c41] hover:text-[#2a7d5a] dark:text-emerald-400 font-medium underline inline-flex items-center gap-1 transition-colors duration-300"
            whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            aboutcookies.org<ExternalLink className="w-3 h-3" />
          </motion.a>
          {parts[1]}
        </motion.p>
      )
    }
    return (
      <motion.p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed"
        initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }} viewport={{ once: true }}>
        {content}
      </motion.p>
    )
  }

  useEffect(() => {
    setMounted(true)
    const hash = window.location.hash
    if (hash) {
      const element = document.getElementById(hash.substring(1))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [])

  if (!mounted) return null

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      
      <section className="relative py-12 bg-gradient-to-r from-[#1a5c41] via-[#2a7d5a] to-[#1a5c41] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 overflow-hidden pointer-events-none">
          <motion.h1 className="text-white text-8xl md:text-9xl font-bold uppercase tracking-widest whitespace-nowrap" style={{ y }}>
            {translations.watermark[language as keyof typeof translations.watermark]}
          </motion.h1>
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <motion.div className="text-center" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.div className="inline-block relative mb-4" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <Cookie className="w-16 h-16 text-white/90 mx-auto mb-4" />
            </motion.div>
            
            <motion.h1 className="text-white text-4xl md:text-6xl font-bold mb-4 tracking-wide" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
              {translations.title[language as keyof typeof translations.title]}
            </motion.h1>
            
            <motion.h2 className="text-white/90 text-xl md:text-2xl font-medium mb-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
              {translations.subtitle[language as keyof typeof translations.subtitle]}
            </motion.h2>
            
            <motion.p className="text-white/80 text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}>
              {translations.lastUpdated[language as keyof typeof translations.lastUpdated]}
            </motion.p>
            
            <motion.div className="mt-6 flex justify-center" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.6 }}>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
                <p className="text-white text-sm font-medium">
                  {translations.tagline[language as keyof typeof translations.tagline]}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/5 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/5 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/5 rounded-full animate-pulse delay-500"></div>
        </div>
      </section>
      
      <main className="container mx-auto px-4 py-16">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <motion.div className="lg:col-span-3" variants={itemVariants}>
              <div className="sticky top-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h3 className="text-[#1a5c41] dark:text-emerald-400 text-lg font-bold mb-4 flex items-center">
                    <Cookie className="w-5 h-5 mr-2" />
                    {language === 'es' ? 'Índice' : 'Index'}
                  </h3>
                  <nav className="space-y-2">
                    {Object.entries(translations.sections).map(([key, section], index) => {
                      const Icon = section.icon
                      return (
                        <motion.a key={key} href={`#${key}`}
                          className="flex items-center p-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-[#2a7d5a]/10 hover:text-[#1a5c41] dark:hover:text-emerald-400 transition-all duration-300 group"
                          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }} whileHover={{ x: 5 }}>
                          <Icon className="w-4 h-4 mr-3 text-[#2a7d5a] group-hover:scale-110 transition-transform duration-300" />
                          <span className="text-sm font-medium">
                            {section.title[language as keyof typeof section.title]}
                          </span>
                        </motion.a>
                      )
                    })}
                  </nav>
                </div>
              </div>
            </motion.div>

            <motion.div className="lg:col-span-9" variants={itemVariants}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                {Object.entries(translations.sections).map(([key, section], index) => (
                  <motion.section key={key} id={key} 
                    className={`p-8 md:p-12 ${index !== Object.keys(translations.sections).length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}
                    initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }} viewport={{ once: true, margin: "-100px" }}>
                    
                    <motion.div className="flex items-center mb-6" whileHover={{ x: 5 }} transition={{ duration: 0.3 }}>
                      <motion.div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2a7d5a] to-[#1a5c41] flex items-center justify-center mr-4 shadow-lg"
                        whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.3 }}>
                        <section.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                          {section.title[language as keyof typeof section.title]}
                        </h2>
                        <motion.div className="h-1 bg-gradient-to-r from-[#2a7d5a] to-[#1a5c41] rounded-full mt-2"
                          initial={{ width: 0 }} whileInView={{ width: "60px" }}
                          transition={{ delay: 0.3, duration: 0.6 }} viewport={{ once: true }} />
                      </div>
                    </motion.div>
                    
                    <div className="ml-16">
                      {key === 'cookieTypes' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {['essential', 'performance', 'functionality', 'advertising'].map((type, typeIndex) => {
                            const cookieType = (section as any)[type]
                            return (
                              <motion.div key={type}
                                className="bg-gradient-to-br from-[#2a7d5a]/5 to-[#1a5c41]/5 rounded-xl p-6 border border-[#2a7d5a]/20"
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: typeIndex * 0.1, duration: 0.6 }}
                                viewport={{ once: true }} whileHover={{ scale: 1.02, y: -2 }}>
                                <div className="flex items-center mb-4">
                                  <cookieType.icon className="w-6 h-6 text-[#2a7d5a] mr-3" />
                                  <h3 className="text-lg font-bold text-[#1a5c41] dark:text-emerald-400">
                                    {cookieType.title[language as keyof typeof cookieType.title]}
                                  </h3>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                  {cookieType.content[language as keyof typeof cookieType.content]}
                                </p>
                              </motion.div>
                            )
                          })}
                        </div>
                      ) : key === 'contact' ? (
                        <div>
                          {'content' in section && renderContent(section.content[language as keyof typeof section.content])}
                          <motion.div className="mt-6 space-y-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} viewport={{ once: true }}>
                            <motion.div className="flex items-center p-4 bg-gradient-to-r from-[#2a7d5a]/10 to-[#1a5c41]/10 rounded-xl border border-[#2a7d5a]/20" whileHover={{ scale: 1.02 }}>
                              <Mail className="w-5 h-5 text-[#2a7d5a] mr-3" />
                              <a href={`mailto:${translations.sections.contact.email}`} className="text-[#1a5c41] dark:text-emerald-400 font-medium hover:underline transition-colors">
                                {translations.sections.contact.email}
                              </a>
                            </motion.div>
                            <motion.div className="flex items-center p-4 bg-gradient-to-r from-[#2a7d5a]/10 to-[#1a5c41]/10 rounded-xl border border-[#2a7d5a]/20" whileHover={{ scale: 1.02 }}>
                              <Phone className="w-5 h-5 text-[#2a7d5a] mr-3" />
                              <a href={`tel:${translations.sections.contact.phone}`} className="text-[#1a5c41] dark:text-emerald-400 font-medium hover:underline transition-colors">
                                {translations.sections.contact.phone}
                              </a>
                            </motion.div>
                            <motion.div className="flex items-center p-4 bg-gradient-to-r from-[#2a7d5a]/10 to-[#1a5c41]/10 rounded-xl border border-[#2a7d5a]/20" whileHover={{ scale: 1.02 }}>
                              <Phone className="w-5 h-5 text-[#2a7d5a] mr-3" />
                              <a href={`tel:${translations.sections.contact.phone2}`} className="text-[#1a5c41] dark:text-emerald-400 font-medium hover:underline transition-colors">
                                {translations.sections.contact.phone2}
                              </a>
                            </motion.div>
                          </motion.div>
                        </div>
                      ) : (
                        'content' in section
                          ? renderContent(section.content[language as keyof typeof section.content])
                          : null
                      )}
                    </div>
                  </motion.section>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  )
}