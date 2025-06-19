"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { motion, useScroll, useTransform } from "framer-motion"
import { Scale, Building, FileText, AlertTriangle, Globe, Gavel, Mail, Phone } from "lucide-react"

export default function AvisoLegalPage() {
  const { t, language } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  // Definir las traducciones
  const translations = {
    watermark: {
      es: "LEGAL",
      en: "LEGAL"
    },
    title: {
      es: "Aviso Legal",
      en: "Legal Notice"
    },
    subtitle: {
      es: "CONDICIONES DE USO Y TÉRMINOS LEGALES",
      en: "TERMS OF USE AND LEGAL CONDITIONS"
    },
    lastUpdated: {
      es: "Última actualización: 13 de junio de 2025",
      en: "Last updated: June 13, 2025"
    },
    tagline: {
      es: "Transparencia en nuestros términos legales",
      en: "Transparency in our legal terms"
    },
    sections: {
      identification: {
        title: {
          es: "Identificación del Titular",
          en: "Owner Identification"
        },
        icon: Building,
        content: {
          es: [
            "En cumplimiento de la normativa vigente, CROMU informa a los usuarios del sitio web de los datos identificativos de la entidad:",
            "• Denominación Social: CROMU",
            "• Domicilio: Villa del Río, Colombia",
            "• Correo Electrónico: atencionclientecromu@gmail.com",
            "• Teléfono: +57 314 2556085 / +57 310 2223491"
          ],
          en: [
            "In compliance with current regulations, CROMU informs website users of the entity's identifying data:",
            "• Legal Name: CROMU",
            "• Address: Villa del Río, Colombia",
            "• Email: atencionclientecromu@gmail.com",
            "• Phone: +57 314 2556085 / +57 310 2223491"
          ]
        }
      },
      conditions: {
        title: {
          es: "Condiciones de Uso",
          en: "Terms of Use"
        },
        icon: FileText,
        content: {
          es: [
            "El acceso y uso de este sitio web le otorga la condición de USUARIO, que acepta, desde dicho acceso y/o uso, las presentes condiciones de uso, rigiéndose en todo momento por la legislación vigente en materia de propiedad intelectual y protección de datos.",
            "El usuario se compromete a hacer un uso adecuado de los contenidos y servicios que CROMU ofrece a través de su portal y con carácter enunciativo pero no limitativo:",
            "• No emplear los contenidos y servicios ofrecidos para incurrir en actividades ilícitas, ilegales o contrarias a la buena fe y al orden público",
            "• No difundir contenidos o propaganda de carácter racista, xenófobo, pornográfico-ilegal, de apología del terrorismo o atentatorio contra los derechos humanos",
            "• No causar daños en los sistemas físicos y lógicos de CROMU, de sus proveedores o de terceras personas"
          ],
          en: [
            "Access and use of this website grants you USER status, which accepts, from such access and/or use, these terms of use, being governed at all times by current legislation on intellectual property and data protection.",
            "The user agrees to make appropriate use of the contents and services that CROMU offers through its portal, including but not limited to:",
            "• Not using the contents and services offered to engage in unlawful, illegal activities contrary to good faith and public order",
            "• Not disseminating content or propaganda of a racist, xenophobic, illegal-pornographic nature, apology for terrorism or against human rights",
            "• Not causing damage to the physical and logical systems of CROMU, its suppliers or third parties"
          ]
        }
      },
      intellectual: {
        title: {
          es: "Propiedad Intelectual e Industrial",
          en: "Intellectual and Industrial Property"
        },
        icon: Scale,
        content: {
          es: [
            "Todos los derechos de propiedad intelectual del contenido de este sitio web, su diseño gráfico, códigos, textos, imágenes, marcas, logotipos, botones, archivos de software, nombres comerciales, denominaciones, dibujos industriales y cualesquiera otros signos susceptibles de utilización industrial y comercial están sujetos a los derechos de propiedad intelectual de CROMU o de terceros titulares de los mismos que han autorizado debidamente su inclusión en el sitio web.",
            "Queda expresamente prohibida la reproducción, distribución, transformación, manipulación y cualquier otra forma de explotación, por cualquier procedimiento, de los contenidos del sitio web sin la previa autorización por escrito de sus titulares.",
            "El incumplimiento de estas disposiciones podrá ser constitutivo de una infracción sancionable por la legislación vigente."
          ],
          en: [
            "All intellectual property rights of the content of this website, its graphic design, codes, texts, images, trademarks, logos, buttons, software files, trade names, denominations, industrial designs and any other signs susceptible to industrial and commercial use are subject to the intellectual property rights of CROMU or third-party holders who have duly authorized their inclusion on the website.",
            "The reproduction, distribution, transformation, manipulation and any other form of exploitation, by any procedure, of the contents of the website without prior written authorization from their holders is expressly prohibited.",
            "Non-compliance with these provisions may constitute an infraction punishable by current legislation."
          ]
        }
      },
      responsibility: {
        title: {
          es: "Responsabilidad",
          en: "Responsibility"
        },
        icon: AlertTriangle,
        content: {
          es: [
            "CROMU no se hace responsable de los daños y perjuicios que puedan derivarse de:",
            "• Interrupciones, suspensiones o desconexiones de los servicios",
            "• Falta de disponibilidad o continuidad de los servicios",
            "• Falta de exactitud, exhaustividad o actualidad de los contenidos",
            "• Presencia de virus o elementos lesivos en los contenidos",
            "• Uso ilícito o inadecuado del sitio web"
          ],
          en: [
            "CROMU is not responsible for damages that may arise from:",
            "• Interruptions, suspensions or disconnections of services",
            "• Lack of availability or continuity of services",
            "• Lack of accuracy, completeness or timeliness of content",
            "• Presence of viruses or harmful elements in content",
            "• Illicit or inappropriate use of the website"
          ]
        }
      },
      availability: {
        title: {
          es: "Disponibilidad y Continuidad",
          en: "Availability and Continuity"
        },
        icon: Globe,
        content: {
          es: [
            "CROMU no garantiza la disponibilidad y continuidad del funcionamiento del sitio web. Cuando sea razonablemente posible, se advertirá previamente de las interrupciones en el funcionamiento del sitio web.",
            "CROMU tampoco garantiza la utilidad del sitio web para la realización de ninguna actividad en particular, ni su infalibilidad y, en particular, aunque no de modo exclusivo, que los usuarios puedan efectivamente utilizar el sitio web, acceder a las distintas páginas web que forman el sitio web o a aquéllas desde las que se presta el servicio."
          ],
          en: [
            "CROMU does not guarantee the availability and continuity of website operation. When reasonably possible, interruptions in website operation will be warned in advance.",
            "CROMU also does not guarantee the usefulness of the website for carrying out any particular activity, nor its infallibility and, in particular, although not exclusively, that users can effectively use the website, access the different web pages that make up the website or those from which the service is provided."
          ]
        }
      },
      links: {
        title: {
          es: "Enlaces a Otros Sitios Web",
          en: "Links to Other Websites"
        },
        icon: Globe,
        content: {
          es: [
            "En el caso de que en el sitio web se dispusiesen enlaces o hipervínculos hacia otros sitios de Internet, CROMU no ejercerá ningún tipo de control sobre dichos sitios y contenidos.",
            "En ningún caso CROMU asumirá responsabilidad alguna por los contenidos de algún enlace perteneciente a un sitio web ajeno, ni garantizará la disponibilidad técnica, calidad, fiabilidad, exactitud, amplitud, veracidad, validez y constitucionalidad de cualquier material o información contenida en ninguno de dichos hipervínculos u otros sitios de Internet.",
            "La inclusión de estas conexiones externas no implicará ningún tipo de asociación, fusión o participación con las entidades conectadas."
          ],
          en: [
            "In the event that links or hyperlinks to other Internet sites are provided on the website, CROMU will not exercise any type of control over such sites and content.",
            "Under no circumstances will CROMU assume any responsibility for the contents of any link belonging to a third-party website, nor will it guarantee the technical availability, quality, reliability, accuracy, breadth, veracity, validity and constitutionality of any material or information contained in any of said hyperlinks or other Internet sites.",
            "The inclusion of these external connections will not imply any type of association, merger or participation with the connected entities."
          ]
        }
      },
      legislation: {
        title: {
          es: "Legislación Aplicable y Jurisdicción",
          en: "Applicable Legislation and Jurisdiction"
        },
        icon: Gavel,
        content: {
          es: [
            "Las presentes condiciones generales se rigen por la legislación colombiana. Para la resolución de cualquier controversia o conflicto que pudiera surgir con ocasión de la prestación de los servicios objeto de las presentes condiciones generales, las partes se someten a la jurisdicción de los Juzgados y Tribunales de la ciudad de Bogotá, con renuncia a cualquier otro fuero que pudiera corresponderles.",
            "En caso de que cualquier disposición de estos términos sea declarada inválida o inaplicable por un tribunal competente, las disposiciones restantes permanecerán en pleno vigor y efecto."
          ],
          en: [
            "These general conditions are governed by Colombian legislation. For the resolution of any controversy or conflict that may arise on the occasion of providing the services subject to these general conditions, the parties submit to the jurisdiction of the Courts and Tribunals of the city of Bogotá, waiving any other jurisdiction that may correspond to them.",
            "In the event that any provision of these terms is declared invalid or unenforceable by a competent court, the remaining provisions shall remain in full force and effect."
          ]
        }
      },
      modifications: {
        title: {
          es: "Modificaciones",
          en: "Modifications"
        },
        icon: FileText,
        content: {
          es: [
            "CROMU se reserva el derecho a efectuar sin previo aviso las modificaciones que considere oportunas en su portal, pudiendo cambiar, suprimir o añadir tanto los contenidos y servicios que se presten a través de la misma como la forma en la que éstos aparezcan presentados o localizados en su portal.",
            "Asimismo, CROMU se reserva el derecho a modificar las presentes condiciones de uso en cualquier momento. Los usuarios serán informados de dichos cambios mediante la publicación de las condiciones modificadas en el sitio web.",
            "El uso continuado del sitio web después de la publicación de cualquier modificación constituirá la aceptación de dichas modificaciones por parte del usuario."
          ],
          en: [
            "CROMU reserves the right to make modifications it deems appropriate to its portal without prior notice, being able to change, delete or add both the contents and services provided through it as well as the way in which they appear presented or located on its portal.",
            "Likewise, CROMU reserves the right to modify these terms of use at any time. Users will be informed of such changes through the publication of the modified conditions on the website.",
            "Continued use of the website after publication of any modification will constitute acceptance of such modifications by the user."
          ]
        }
      },
      contact: {
        title: {
          es: "Contacto",
          en: "Contact"
        },
        icon: Mail,
        content: {
          es: "Para cualquier consulta relacionada con este aviso legal o los términos de uso del sitio web, puede contactarnos a través de los siguientes medios:",
          en: "For any questions related to this legal notice or the terms of use of the website, you can contact us through the following means:"
        },
        email: "atencionclientecromu@gmail.com",
        phone: "+57 314 2556085",
        phone2: "+57 310 2223491"
      }
    }
  }

  // Función para renderizar el contenido
  const renderContent = (content: string | string[]) => {
    if (Array.isArray(content)) {
      return content.map((item, index) => (
        <motion.p 
          key={index} 
          className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          viewport={{ once: true }}
        >
          {item}
        </motion.p>
      ))
    }
    return (
      <motion.p 
        className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        {content}
      </motion.p>
    )
  }

  // Efecto para manejar el scroll suave a las secciones
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
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0, 0, 0.58, 1] // cubic-bezier for easeOut
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      
      {/* Hero Section con paralaje */}
      <section className="relative py-12 bg-gradient-to-r from-[#1a5c41] via-[#2a7d5a] to-[#1a5c41] overflow-hidden">
        {/* Watermark animado */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 overflow-hidden pointer-events-none">
          <motion.h1 
            className="text-white text-8xl md:text-9xl font-bold uppercase tracking-widest whitespace-nowrap"
            style={{ y }}
          >
            {translations.watermark[language as keyof typeof translations.watermark]}
          </motion.h1>
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block relative mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Scale className="w-16 h-16 text-white/90 mx-auto mb-4" />
            </motion.div>
            
            <motion.h1 
              className="text-white text-4xl md:text-6xl font-bold mb-4 tracking-wide"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {translations.title[language as keyof typeof translations.title]}
            </motion.h1>
            
            <motion.h2
              className="text-white/90 text-xl md:text-2xl font-medium mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {translations.subtitle[language as keyof typeof translations.subtitle]}
            </motion.h2>
            
            <motion.p
              className="text-white/80 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {translations.lastUpdated[language as keyof typeof translations.lastUpdated]}
            </motion.p>
            
            <motion.div
              className="mt-6 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
                <p className="text-white text-sm font-medium">
                  {translations.tagline[language as keyof typeof translations.tagline]}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/5 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/5 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/5 rounded-full animate-pulse delay-500"></div>
        </div>
      </section>
      
      <main className="container mx-auto px-4 py-16">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          {/* Contenido principal */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar con navegación */}
            <motion.div 
              className="lg:col-span-3"
            >
              <div className="sticky top-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h3 className="text-[#1a5c41] dark:text-emerald-400 text-lg font-bold mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    {language === 'es' ? 'Índice' : 'Index'}
                  </h3>
                  <nav className="space-y-2">
                    {Object.entries(translations.sections).map(([key, section], index) => {
                      const Icon = section.icon
                      return (
                        <motion.a
                          key={key}
                          href={`#${key}`}
                          className="flex items-center p-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-[#2a7d5a]/10 hover:text-[#1a5c41] dark:hover:text-emerald-400 transition-all duration-300 group"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          whileHover={{ x: 5 }}
                        >
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

            {/* Contenido principal */}
            <motion.div 
              className="lg:col-span-9"

            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                {Object.entries(translations.sections).map(([key, section], index) => {
                  const Icon = section.icon
                  return (
                    <motion.section 
                      key={key} 
                      id={key}
                      className="p-8 md:p-12 border-b border-gray-100 dark:border-gray-700 last:border-b-0 scroll-mt-20"
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true, margin: "-100px" }}
                    >
                      <motion.div 
                        className="flex items-center mb-6"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div 
                          className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2a7d5a] to-[#1a5c41] flex items-center justify-center mr-4 shadow-lg"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </motion.div>
                        <div>
                          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                            {section.title[language as keyof typeof section.title]}
                          </h2>
                          <motion.div
                            className="h-1 bg-gradient-to-r from-[#2a7d5a] to-[#1a5c41] rounded-full mt-2"
                            initial={{ width: 0 }}
                            whileInView={{ width: "60px" }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            viewport={{ once: true }}
                          />
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="ml-16 space-y-4"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        viewport={{ once: true }}
                      >
                        {renderContent(section.content[language as keyof typeof section.content])}
                        
                        {key === 'contact' && (
                          <motion.div 
                            className="mt-8 p-6 bg-gradient-to-br from-[#2a7d5a]/5 to-[#1a5c41]/5 rounded-xl border border-[#2a7d5a]/20"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            viewport={{ once: true }}
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <motion.div 
                                className="flex items-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
                                whileHover={{ scale: 1.02, y: -2 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Mail className="w-5 h-5 text-[#2a7d5a] mr-3" />
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                  <a 
                                    href={`mailto:${(section as any).email}`}
                                    className="text-[#1a5c41] hover:text-[#2a7d5a] dark:text-emerald-400 font-medium transition-colors duration-300"
                                  >
                                    {(section as any).email}
                                  </a>
                                </div>
                              </motion.div>
                              
                              <motion.div 
                                className="flex items-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
                                whileHover={{ scale: 1.02, y: -2 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Phone className="w-5 h-5 text-[#2a7d5a] mr-3" />
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Teléfono</p>
                                  <p className="text-gray-800 dark:text-gray-300 font-medium">
                                    {(section as any).phone} | {(section as any).phone2}
                                  </p>
                                </div>
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    </motion.section>
                  )
                })}
                
                {/* Footer del aviso legal */}
                <motion.div 
                  className="bg-gradient-to-r from-[#1a5c41] to-[#2a7d5a] p-8 text-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Scale className="w-12 h-12 text-white/90 mx-auto mb-4" />
                    <p className="text-white text-lg font-medium mb-2">
                      © {new Date().getFullYear()} CROMU
                    </p>
                    <p className="text-white/80">
                      {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  )
}