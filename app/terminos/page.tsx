"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { motion, AnimatePresence } from "framer-motion"
import { FiChevronRight, FiMail } from "react-icons/fi"

export default function TerminosPage() {
  const { language } = useLanguage() // Elimina 't'
  const [activeSection, setActiveSection] = useState<string | null>(null)

  // Definir las traducciones
  const translations = {
    title: {
      es: "Términos y Condiciones de Uso",
      en: "Terms and Conditions of Use"
    },
    lastUpdated: {
      es: "Última actualización: 13 de junio de 2025",
      en: "Last updated: June 13, 2025"
    },
    tableOfContents: {
      es: "Tabla de Contenidos",
      en: "Table of Contents"
    },
    sections: {
      acceptance: {
        title: {
          es: "Aceptación de los Términos",
          en: "Acceptance of Terms"
        },
        content: {
          es: "Al acceder y utilizar los servicios de CROMU, usted acepta cumplir con estos términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá utilizar nuestros servicios.",
          en: "By accessing and using CROMU's services, you agree to comply with these terms and conditions. If you do not agree with any part of these terms, you may not use our services."
        }
      },
      service: {
        title: {
          es: "Descripción del Servicio",
          en: "Service Description"
        },
        content: {
          es: "CROMU proporciona servicios financieros incluyendo pero no limitado a fondos de ahorro, préstamos y otros servicios relacionados. Los términos específicos de cada servicio se detallan en los contratos individuales.",
          en: "CROMU provides financial services including but not limited to savings funds, loans, and other related services. The specific terms of each service are detailed in individual contracts."
        }
      },
      usage: {
        title: {
          es: "Uso Aceptable",
          en: "Acceptable Use"
        },
        content: {
          es: [
            "Usted se compromete a utilizar nuestros servicios de manera legal y ética. No está permitido:",
            "• Utilizar los servicios para actividades ilegales o fraudulentas.",
            "• Intentar acceder a cuentas o información de otros usuarios sin autorización.",
            "• Interferir con la seguridad o el funcionamiento de nuestros servicios.",
            "• Proporcionar información falsa o engañosa."
          ],
          en: [
            "You agree to use our services legally and ethically. You may not:",
            "• Use the services for illegal or fraudulent activities.",
            "• Attempt to access other users' accounts or information without authorization.",
            "• Interfere with the security or operation of our services.",
            "• Provide false or misleading information."
          ]
        }
      },
      privacy: {
        title: {
          es: "Privacidad",
          en: "Privacy"
        },
        content: {
          es: "La protección de sus datos personales es importante para nosotros. Nuestra Política de Privacidad describe cómo recopilamos, usamos y protegemos su información. Al utilizar nuestros servicios, usted acepta nuestras prácticas de privacidad.",
          en: "The protection of your personal data is important to us. Our Privacy Policy describes how we collect, use, and protect your information. By using our services, you agree to our privacy practices."
        }
      },
      modifications: {
        title: {
          es: "Modificaciones",
          en: "Modifications"
        },
        content: {
          es: "Nos reservamos el derecho de modificar estos términos en cualquier momento. Las actualizaciones entrarán en vigor inmediatamente después de su publicación. El uso continuado de nuestros servicios después de dichos cambios constituirá su consentimiento a los mismos.",
          en: "We reserve the right to modify these terms at any time. Updates will take effect immediately after posting. Continued use of our services after such changes constitutes your consent to them."
        }
      },
      liability: {
        title: {
          es: "Limitación de Responsabilidad",
          en: "Limitation of Liability"
        },
        content: {
          es: "CROMU no será responsable por daños indirectos, incidentales, especiales, consecuentes o punitivos que resulten del uso o la imposibilidad de utilizar nuestros servicios.",
          en: "CROMU shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from the use or inability to use our services."
        }
      },
      law: {
        title: {
          es: "Ley Aplicable",
          en: "Governing Law"
        },
        content: {
          es: "Estos términos se regirán e interpretarán de acuerdo con las leyes de Colombia. Cualquier disputa relacionada con estos términos estará sujeta a la jurisdicción exclusiva de los tribunales de Colombia.",
          en: "These terms shall be governed by and construed in accordance with the laws of Colombia. Any dispute relating to these terms shall be subject to the exclusive jurisdiction of the courts of Colombia."
        }
      },
      contact: {
        title: {
          es: "Contacto",
          en: "Contact"
        },
        content: {
          es: "Si tiene alguna pregunta sobre estos Términos y Condiciones, puede contactarnos a través de nuestro sitio web o en la siguiente dirección de correo electrónico:",
          en: "If you have any questions about these Terms and Conditions, you can contact us through our website or at the following email address:"
        },
        email: "atencionclientecromu@gmail.com"
      }
    }
  }

  // Efecto para manejar el scroll y resaltar la sección activa
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]')
      let current: string | null = null
      
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top
        if (sectionTop <= 100) {
          current = section.getAttribute('id')
        }
      })
      
      if (current) {
        setActiveSection(current)
        window.history.replaceState(null, '', `#${current}`)
      }
    }

    // Manejar hash inicial
    const hash = window.location.hash.substring(1)
    if (hash) {
      const element = document.getElementById(hash)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
          setActiveSection(hash)
        }, 100)
      }
    } else {
      setActiveSection(Object.keys(translations.sections)[0])
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [language, translations.sections]) // Agrega translations.sections

  // Función para renderizar el contenido, manejando tanto strings como arrays
  const renderContent = (content: string | string[]) => {
    if (Array.isArray(content)) {
      return content.map((item, index) => (
        <motion.p 
          key={index} 
          className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          {item}
        </motion.p>
      ))
    }
    return (
      <motion.p 
        className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {content}
      </motion.p>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-[#f0f9f7] dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Header />
      
      <main className="container mx-auto px-4 py-12 md:py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-[#e0f2ec] dark:border-gray-700"
        >
          {/* Header con gradiente */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#50A58D] to-[#3a7d6a] opacity-95"></div>
            <div className="relative z-10 p-8 md:p-12 text-white">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">
                  {translations.title[language as keyof typeof translations.title]}
                </h1>
                <div className="w-20 h-1.5 bg-[#8bc4b2] rounded-full mb-4"></div>
                <p className="text-[#d1e8e1] text-lg">
                  {translations.lastUpdated[language as keyof typeof translations.lastUpdated]}
                </p>
              </motion.div>
            </div>
            
            {/* Onda decorativa */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-white dark:bg-gray-800 rounded-t-3xl"></div>
          </div>
          
          <div className="flex flex-col lg:flex-row">
            {/* Sidebar con tabla de contenidos */}
            <motion.aside 
              className="lg:w-64 flex-shrink-0 bg-[#f8fcfb] dark:bg-gray-700 p-6 border-r border-[#e0f2ec] dark:border-gray-600"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <FiChevronRight className="mr-2 text-[#50A58D]" />
                {translations.tableOfContents[language as keyof typeof translations.tableOfContents]}
              </h3>
              <nav className="space-y-2">
                {Object.entries(translations.sections).map(([key, section], index) => (
                  <a
                    key={key}
                    href={`#${key}`}
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById(key)?.scrollIntoView({ behavior: 'smooth' })
                      setActiveSection(key)
                    }}
                    className={`block px-3 py-2 rounded-lg transition-all duration-200 ${
                      activeSection === key 
                        ? 'bg-[#e0f2ec] text-[#2d6b5a] dark:bg-[#2d6b5a] dark:text-[#e0f2ec] font-medium' 
                        : 'text-gray-600 hover:bg-[#f0f9f7] dark:text-gray-300 dark:hover:bg-gray-600/50'
                    }`}
                  >
                    <span className="text-[#50A58D] dark:text-[#8bc4b2] font-mono mr-2">0{index + 1}.</span>
                    {section.title[language as keyof typeof section.title]}
                  </a>
                ))}
              </nav>
              
              <div className="mt-8 pt-6 border-t border-[#e0f2ec] dark:border-gray-600">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {language === 'es' ? '¿Necesitas ayuda?' : 'Need help?'}
                </p>
                <a 
                  href={`mailto:${translations.sections.contact.email}`}
                  className="inline-flex items-center text-[#3a7d6a] dark:text-[#8bc4b2] hover:text-[#2d6b5a] dark:hover:text-[#c1e0d8] transition-colors"
                >
                  <FiMail className="mr-2" />
                  {translations.sections.contact.email}
                </a>
              </div>
            </motion.aside>
            
            {/* Contenido principal */}
            <div className="flex-1 p-6 md:p-10 lg:p-12">
              <AnimatePresence mode="wait">
                {Object.entries(translations.sections).map(([key, section]) => (
                  <motion.section 
                    key={key}
                    id={key}
                    className="mb-12 last:mb-0 scroll-mt-24"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { 
                        duration: 0.4,
                        ease: "easeOut"
                      }
                    }}
                    exit={{ opacity: 0, y: 20 }}
                  >
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="inline-block"
                    >
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 relative group">
                        <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-[#50A58D] opacity-0 group-hover:opacity-100 transition-opacity">
                          #
                        </span>
                        <span className="relative">
                          {section.title[language as keyof typeof section.title]}
                        </span>
                      </h2>
                    </motion.div>
                    
                    <motion.div 
                      className="ml-0 md:ml-4 pl-0 md:pl-6 border-l-0 md:border-l-2 border-[#e0f2ec] dark:border-[#2d6b5a]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {renderContent(section.content[language as keyof typeof section.content])}
                    </motion.div>
                  </motion.section>
                ))}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-6 text-center border-t border-gray-100 dark:border-gray-700">
            <motion.p 
              className="text-gray-500 dark:text-gray-400 text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              © {new Date().getFullYear()} CROMU. {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
            </motion.p>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  )
}
