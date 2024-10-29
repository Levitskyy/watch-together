export const metadata = {
    title: 'React App',
    description: 'Next.js created app',
}

export default function RootLayout({ children }) {
    return (
        <!DOCTYPE html>
        <html lang="en">
          <body>
            <div id="root">{children}</div>
          </body>
        </html>        
    )
  }