import React, { useRef, useEffect, useState, ReactNode } from 'react'
import { ChevronDown, Check, User, Settings, LogOut, Bell, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { Portal } from './Portal'
import { Avatar } from './Avatar'

export interface DropdownItem {
  label?: string
  value?: string
  icon?: ReactNode
  disabled?: boolean
  danger?: boolean
  divider?: boolean
}

export interface DropdownProps {
  trigger: ReactNode
  items: DropdownItem[]
  onSelect: (value: string) => void
  selectedValue?: string
  placeholder?: string
  align?: 'left' | 'right'
  className?: string
}

export function Dropdown({ trigger, items, onSelect, selectedValue, align = 'left', className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isOpen) return
      if (event.key === 'Escape') {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <div className={cn('relative inline-block', className)} ref={dropdownRef}>
      <div ref={triggerRef}>
        {React.isValidElement(trigger)
          ? React.cloneElement(trigger as React.ReactElement, {
              onClick: (e: React.MouseEvent) => {
                e.stopPropagation()
                setIsOpen(!isOpen)
              },
              'aria-haspopup': 'listbox',
              'aria-expanded': isOpen,
            })
          : (
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen(!isOpen)
              }}
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              className="w-full justify-between"
            >
              {trigger}
              <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
            </Button>
          )}
      </div>

      {isOpen && (
        <Portal>
          <div
            className={cn(
              'fixed z-50 mt-1.5 min-w-[200px] bg-white/90 dark:bg-[#221b12]/90 backdrop-blur-2xl rounded-xl border border-[var(--color-border-primary)] shadow-lg py-1 animate-slide-down',
              align === 'right' ? 'right-0' : 'left-0'
            )}
            role="listbox"
            aria-label="Options"
          >
            {items.map((item, index) => {
              if (item.divider) {
                return <div key={`divider-${index}`} className="border-t border-slate-200 dark:border-slate-700 my-1" role="separator" />
              }
              const isSelected = selectedValue === item.value
              return (
                <button
                  key={item.value ?? index}
                  role="option"
                  aria-selected={isSelected}
                  disabled={item.disabled}
                  onClick={() => {
                    if (!item.disabled) {
                      onSelect(item.value ?? '')
                      setIsOpen(false)
                    }
                  }}
                  className={cn(
                    'w-full px-4 py-2.5 text-left text-body-sm flex items-center gap-3 transition-colors',
                    'hover:bg-[var(--color-bg-tertiary)]',
                    item.danger ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-300',
                    item.disabled && 'opacity-50 cursor-not-allowed',
                    isSelected && 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
                  )}
                >
                  {item.icon && <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>}
                  <span className="flex-1">{item.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-brand-500" />}
                </button>
              )
            })}
          </div>
        </Portal>
      )}
    </div>
  )
}

export function UserMenu({ user, onProfile, onNotifications, onContact, onSettings, onLogout }: {
  user: { name: string; email: string; avatar?: string; role?: string }
  onProfile: () => void
  onNotifications?: () => void
  onContact?: () => void
  onSettings: () => void
  onLogout: () => void
}) {
  const handleSelect = (value: string) => {
    switch (value) {
      case 'profile':
        onProfile()
        break
      case 'notifications':
        onNotifications?.()
        break
      case 'contact':
        onContact?.()
        break
      case 'settings':
        onSettings()
        break
      case 'logout':
        onLogout()
        break
    }
  }

  return (
    <Dropdown
      trigger={
        <div className="flex items-center gap-3 pr-2">
          <Avatar src={user.avatar} name={user.name} size="sm" />
          <div className="hidden sm:block text-left">
            <p className="text-body-sm font-medium text-slate-900 dark:text-slate-100">{user.name}</p>
            <p className="text-body-xs text-slate-500 dark:text-slate-400">{user.email}</p>
          </div>
        </div>
      }
      items={[
        { label: 'Profil', value: 'profile', icon: <User className="w-4 h-4" /> },
        { label: 'Notifications', value: 'notifications', icon: <Bell className="w-4 h-4" /> },
        { label: 'Contact', value: 'contact', icon: <Phone className="w-4 h-4" /> },
        { label: 'Paramètres', value: 'settings', icon: <Settings className="w-4 h-4" /> },
        { divider: true },
        { label: 'Déconnexion', value: 'logout', icon: <LogOut className="w-4 h-4" />, danger: true },
      ]}
      onSelect={handleSelect}
      align="right"
    />
  )
}